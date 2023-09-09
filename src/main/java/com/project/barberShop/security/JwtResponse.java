package com.project.barberShop.security;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private List<String> roles;

    public JwtResponse(String accessToken, Long id, String email, String firstName,
                       String lastName, String phoneNumber, List<String> roles) {
        this.token = accessToken;
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber=phoneNumber;
        this.roles = roles;
    }
}
