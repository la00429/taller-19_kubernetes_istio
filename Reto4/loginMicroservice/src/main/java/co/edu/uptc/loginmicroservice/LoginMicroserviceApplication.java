package co.edu.uptc.loginmicroservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class LoginMicroserviceApplication {
    public static void main(String[] args) {
        SpringApplication.run(LoginMicroserviceApplication.class, args);
    }
}
