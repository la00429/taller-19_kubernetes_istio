package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/Cr1ss4nB/Reto1-Software2/UserMgmtMicroservice/config"
	"github.com/Cr1ss4nB/Reto1-Software2/UserMgmtMicroservice/eureka"
	"github.com/Cr1ss4nB/Reto1-Software2/UserMgmtMicroservice/routes"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load()

	fmt.Println("DB_USER:", os.Getenv("DB_USER"))
	fmt.Println("DB_PASSWORD:", os.Getenv("DB_PASSWORD"))
	fmt.Println("DB_NAME:", os.Getenv("DB_NAME"))

	db, err := config.ConnectDB()
	if err != nil {
		log.Fatalf("error connecting to DB: %v", err)
	}

	if err := config.AutoMigrate(db); err != nil {
		log.Fatalf("auto migrate failed: %v", err)
	}

	// Esperar a que Eureka esté disponible (mejor robustez al reiniciar Eureka)
	go func() {
		eurekaURL := os.Getenv("EUREKA_SERVER")
		if strings.TrimSpace(eurekaURL) == "" {
			eurekaURL = "http://localhost:8761/eureka/apps"
		}
		// Normalizar sin trailing slash para evitar 301s
		eurekaURL = strings.TrimRight(eurekaURL, "/")

		deadline := time.Now().Add(30 * time.Second)
		for {
			resp, err := http.Get(eurekaURL)
			if err == nil && resp != nil && resp.StatusCode < 500 {
				if resp.Body != nil {
					_ = resp.Body.Close()
				}
				break
			}
			if time.Now().After(deadline) {
				// Continuamos aunque no responda; el cliente de Eureka reintenta en heartbeats
				break
			}
			time.Sleep(2 * time.Second)
		}
		// Registrar y comenzar heartbeats (con re-registro automático en 404)
		eureka.RegisterAndHeartbeat()
	}()

	r := gin.Default()

	// Health (also used by Eureka health check)
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "UP"})
	})

	routes.SetupRoutes(r, db)

	port := os.Getenv("SERVER_PORT")
	if port == "" {
		port = "8083"
	}

	// Graceful shutdown: deregistrar en Eureka
	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-sigs
		eureka.Deregister()
		os.Exit(0)
	}()

	fmt.Printf("UserMgmtMicroservice corriendo en :%s\n", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("failed to run server: %v", err)
	}

}
