package routes

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"

	"github.com/Cr1ss4nB/Reto1-Software2/UserMgmtMicroservice/controller"
)

func SetupRoutes(r *gin.Engine, db *gorm.DB) {
	customerController := controller.NewCustomerController(db)
	customerGroup := r.Group("/customer")
	customerController.RegisterRoutes(customerGroup)
}
