package com.auth_service.dto;

import com.auth_service.model.Role;
import lombok.Data;

@Data
public class InfoResponseDto {
    private String username;
    private String email;
    private Role role;
}
