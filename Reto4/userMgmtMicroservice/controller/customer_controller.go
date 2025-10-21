package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/Cr1ss4nB/Reto1-Software2/UserMgmtMicroservice/dto"
	"github.com/Cr1ss4nB/Reto1-Software2/UserMgmtMicroservice/repository"
	"github.com/Cr1ss4nB/Reto1-Software2/UserMgmtMicroservice/service"
	"gorm.io/gorm"
)

type CustomerController struct {
	Service *service.CustomerService
}

func NewCustomerController(db *gorm.DB) *CustomerController {
	repo := repository.NewCustomerRepository(db)
	svc := service.NewCustomerService(repo)
	return &CustomerController{Service: svc}
}

func (cc *CustomerController) RegisterRoutes(rg *gin.RouterGroup) {
	rg.POST("/createcustomer", cc.CreateCustomer)
	rg.PUT("/updatecustomer", cc.UpdateCustomer)
	rg.GET("/findcustomerbyid", cc.FindCustomerByID) // ?customerid=...
}

func (cc *CustomerController) CreateCustomer(c *gin.Context) {
	var req dto.CreateCustomerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"createCustomerValid": false, "error": err.Error()})
		return
	}
	ok, err := cc.Service.CreateCustomer(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"createCustomerValid": false, "error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"createCustomerValid": ok})
}

func (cc *CustomerController) UpdateCustomer(c *gin.Context) {
	var req dto.UpdateCustomerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"updateCustomerValid": false, "error": err.Error()})
		return
	}
	ok, err := cc.Service.UpdateCustomer(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"updateCustomerValid": false, "error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"updateCustomerValid": ok})
}

func (cc *CustomerController) FindCustomerByID(c *gin.Context) {
	customerid := c.Query("customerid")
	if customerid == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "customerid query param required"})
		return
	}
	res, err := cc.Service.FindCustomerByID(customerid)
	if err != nil {
		// GORM returns gorm.ErrRecordNotFound when not found
		c.JSON(http.StatusNotFound, gin.H{"error": "not found"})
		return
	}
	c.JSON(http.StatusOK, res)
}
