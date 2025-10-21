package co.edu.uptc.loginmicroservice.controller;

import co.edu.uptc.loginmicroservice.config.JwtUtil;
import co.edu.uptc.loginmicroservice.domain.User;
import co.edu.uptc.loginmicroservice.dto.LoginRequest;
import co.edu.uptc.loginmicroservice.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/login")
public class UserController {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/createuser")
    public ResponseEntity<Void> createUser(@RequestBody LoginRequest request) {
        User user = new User();
        user.setCustomerId(request.getCustomerId());
        user.setPassword(request.getPassword());
        userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/authuser")
    public ResponseEntity<Map<String,Object>> authUser(@RequestBody LoginRequest request) {
        boolean valid = userService.authenticateUser(request.getCustomerId(), request.getPassword());
        Map<String,Object> response = new HashMap<>();
        response.put("userCreated", valid);
        
        if (valid) {
            String token = jwtUtil.generateToken(request.getCustomerId());
            response.put("token", token);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
}
