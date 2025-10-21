package service

import (
	"errors"

	"github.com/Cr1ss4nB/Reto1-Software2/UserMgmtMicroservice/dto"
	"github.com/Cr1ss4nB/Reto1-Software2/UserMgmtMicroservice/model"
	"github.com/Cr1ss4nB/Reto1-Software2/UserMgmtMicroservice/repository"
)

type CustomerService struct {
	Repo *repository.CustomerRepository
}

func NewCustomerService(repo *repository.CustomerRepository) *CustomerService {
	return &CustomerService{Repo: repo}
}

func (s *CustomerService) CreateCustomer(req dto.CreateCustomerRequest) (bool, error) {
	if existing, _ := s.Repo.FindByDocument(req.Document); existing != nil {
		return false, errors.New("customer already exists")
	}
	c := &model.Customer{
		Document:  req.Document,
		FirstName: req.FirstName,
		LastName:  req.LastName,
		Address:   req.Address,
		Phone:     req.Phone,
		Email:     req.Email,
	}
	if err := s.Repo.CreateCustomer(c); err != nil {
		return false, err
	}
	return true, nil
}

func (s *CustomerService) UpdateCustomer(req dto.UpdateCustomerRequest) (bool, error) {
	updates := map[string]interface{}{}
	if req.FirstName != "" {
		updates["firstname"] = req.FirstName
	}
	if req.LastName != "" {
		updates["lastname"] = req.LastName
	}
	if req.Address != "" {
		updates["address"] = req.Address
	}
	if req.Phone != "" {
		updates["phone"] = req.Phone
	}
	if req.Email != "" {
		updates["email"] = req.Email
	}
	if len(updates) == 0 {
		return false, errors.New("no updates provided")
	}
	if err := s.Repo.UpdateCustomer(req.CustomerID, updates); err != nil {
		return false, err
	}
	return true, nil
}

func (s *CustomerService) FindCustomerByID(customerid string) (*dto.CustomerResponse, error) {
	c, err := s.Repo.FindByDocument(customerid)
	if err != nil {
		return nil, err
	}
	res := &dto.CustomerResponse{
		Document:  c.Document,
		FirstName: c.FirstName,
		LastName:  c.LastName,
		Address:   c.Address,
		Phone:     c.Phone,
		Email:     c.Email,
	}
	return res, nil
}
