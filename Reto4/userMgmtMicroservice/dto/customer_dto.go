package dto

type CreateCustomerRequest struct {
	Document  string `json:"document" binding:"required"`
	FirstName string `json:"firstname" binding:"required"`
	LastName  string `json:"lastname" binding:"required"`
	Address   string `json:"address"`
	Phone     string `json:"phone"`
	Email     string `json:"email"`
}

type UpdateCustomerRequest struct {
	CustomerID string `json:"customerid" binding:"required"`
	FirstName  string `json:"firstname"`
	LastName   string `json:"lastname"`
	Address    string `json:"address"`
	Phone      string `json:"phone"`
	Email      string `json:"email"`
}

type CustomerResponse struct {
	Document  string `json:"document"`
	FirstName string `json:"firstname"`
	LastName  string `json:"lastname"`
	Address   string `json:"address"`
	Phone     string `json:"phone"`
	Email     string `json:"email"`
}
