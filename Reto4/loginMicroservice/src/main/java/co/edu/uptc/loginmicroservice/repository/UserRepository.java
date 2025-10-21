package co.edu.uptc.loginmicroservice.repository;

import co.edu.uptc.loginmicroservice.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User,String> {
}
