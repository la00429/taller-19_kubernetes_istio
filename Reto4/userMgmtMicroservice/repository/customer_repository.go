package repository

import (
	"github.com/Cr1ss4nB/Reto1-Software2/UserMgmtMicroservice/model"
	"gorm.io/gorm"
)

type CustomerRepository struct {
	DB *gorm.DB
}

func NewCustomerRepository(db *gorm.DB) *CustomerRepository {
	return &CustomerRepository{DB: db}
}

func (r *CustomerRepository) CreateCustomer(c *model.Customer) error {
	return r.DB.Create(c).Error
}

func (r *CustomerRepository) UpdateCustomer(document string, updates map[string]interface{}) error {
	return r.DB.Model(&model.Customer{}).Where("document = ?", document).Updates(updates).Error
}

func (r *CustomerRepository) FindByDocument(document string) (*model.Customer, error) {
	var c model.Customer
	err := r.DB.Where("document = ?", document).First(&c).Error
	if err != nil {
		return nil, err
	}
	return &c, nil
}
