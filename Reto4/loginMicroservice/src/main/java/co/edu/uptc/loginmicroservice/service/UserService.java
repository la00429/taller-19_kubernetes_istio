package co.edu.uptc.loginmicroservice.service;

import co.edu.uptc.loginmicroservice.domain.User;
import co.edu.uptc.loginmicroservice.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public boolean authenticateUser(String customerId, String password) {
        Optional<User> userOpt = userRepository.findById(customerId);
        return userOpt.isPresent() && encoder.matches(password, userOpt.get().getPassword());
    }
}
