package model

type Customer struct {
	Document  string `gorm:"primaryKey;column:document" json:"document"`
	FirstName string `gorm:"column:firstname" json:"firstname"`
	LastName  string `gorm:"column:lastname" json:"lastname"`
	Address   string `gorm:"column:address" json:"address"`
	Phone     string `gorm:"column:phone" json:"phone"`
	Email     string `gorm:"column:email" json:"email"`
}

func (Customer) TableName() string {
	return "Customer"
}
