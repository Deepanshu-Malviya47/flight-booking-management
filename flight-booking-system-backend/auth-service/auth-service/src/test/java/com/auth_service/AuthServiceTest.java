package com.auth_service;

import com.auth_service.config.SecurityConfig;
import com.auth_service.dto.LoginRequest;
import com.auth_service.dto.LoginResponse;
import com.auth_service.dto.ResetPasswordRequest;
import com.auth_service.external.MailClient;
import com.auth_service.model.AppUser;
import com.auth_service.model.Role;
import com.auth_service.repositories.AppUserRepository;
import com.auth_service.security.JwtHelper;
import com.auth_service.services.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;
    @Mock private AppUserRepository appUserRepository;
    @Mock private JwtHelper jwtHelper;
    @Mock private SecurityConfig securityConfig;
    @Mock private MailClient mailClient;
    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;


    @BeforeEach
    void init() {
        lenient().when(securityConfig.passwordEncoder()).thenReturn(passwordEncoder);
    }

    @Test
    void testLogin_ValidCredentials_ReturnsToken() {
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("Deepanshu");
        loginRequest.setPassword("ValidPass123!");

        AppUser user = new AppUser(1L, "Deepanshu@example.com", "Deepanshu", "encoded", Role.USER);

        when(appUserRepository.findByUsername("Deepanshu")).thenReturn(Optional.of(user));
        when(jwtHelper.generateToken("Deepanshu", Role.USER)).thenReturn("jwt-token");

        LoginResponse response = authService.login(loginRequest, "USER");

        assertEquals("Deepanshu", response.getUsername());
        assertEquals("jwt-token", response.getToken());
    }

    @Test
    void testRegister_NewUser_SendsOtp() {
        AppUser user = new AppUser(null, "unique@example.com", "uniqueUser", "StrongPass1@", null);

        when(appUserRepository.existsByEmailAndRole("unique@example.com", Role.USER)).thenReturn(false);
        when(appUserRepository.existsByUsernameAndRole("uniqueUser", Role.USER)).thenReturn(false);

        ResponseEntity<String> response = authService.register(user, "USER");

        assertEquals("OTP sent successfully. Please verify OTP to complete registration.", response.getBody());
        verify(mailClient).generateAndSendOtp("unique@example.com");
    }

    @Test
    void testVerifyOtpAndRegister_ValidOtp_SavesUser() {
        AppUser user = new AppUser(null, "otpuser@example.com", "otpUser", "RawPassword1!", null);

        when(mailClient.verifyOtp("otpuser@example.com", "123456")).thenReturn(true);
        when(passwordEncoder.encode("RawPassword1!")).thenReturn("EncodedPassword1!");

        ResponseEntity<String> response = authService.verifyOtpAndRegister(user, "123456", "USER");

        assertEquals("USER registered successfully", response.getBody());
        verify(appUserRepository).save(argThat(savedUser ->
                savedUser.getRole() == Role.USER &&
                        savedUser.getPassword().equals("EncodedPassword1!")
        ));
    }

    @Test
    void testForgotPassword_ValidEmail_SendsOtp() {
        AppUser user = new AppUser(1L, "forgot@example.com", "forgotUser", "pass", Role.USER);

        when(appUserRepository.findByEmailAndRole("forgot@example.com", Role.USER))
                .thenReturn(Optional.of(user));

        ResponseEntity<String> response = authService.forgotPassword("forgot@example.com", "USER");

        assertEquals("OTP sent to your email. Please verify to reset your password.", response.getBody());
        verify(mailClient).generateAndSendOtp("forgot@example.com");
    }

    @Test
    void testVerifyResetPasswordOtp_ValidOtp_UpdatesPassword() {
        ResetPasswordRequest request = new ResetPasswordRequest();
        request.setEmail("reset@example.com");
        request.setOtp("654321");
        request.setNewPassword("NewPassword1!");

        AppUser user = new AppUser(2L, "reset@example.com", "resetUser", "old", Role.USER);

        when(mailClient.verifyOtp("reset@example.com", "654321")).thenReturn(true);
        when(appUserRepository.findByEmailAndRole("reset@example.com", Role.USER))
                .thenReturn(Optional.of(user));
        when(passwordEncoder.encode("NewPassword1!")).thenReturn("EncodedNewPassword!");

        ResponseEntity<String> response = authService.verifyResetPasswordOtp(request, "USER");

        assertEquals("Password reset successfully.", response.getBody());
        verify(appUserRepository).save(user);
        assertEquals("EncodedNewPassword!", user.getPassword());
    }

    @Test
    void testGetAll_ReturnsUserList() {
        List<AppUser> mockUsers = List.of(
                new AppUser(1L, "a@example.com", "userA", "pass", Role.USER),
                new AppUser(2L, "b@example.com", "userB", "pass", Role.ADMIN)
        );

        when(appUserRepository.findAll()).thenReturn(mockUsers);

        List<AppUser> result = authService.getAll();

        assertEquals(2, result.size());
        assertEquals("userA", result.get(0).getUsername());
        assertEquals("userB", result.get(1).getUsername());
    }

    @Test
    void testGetAllByRole_ValidRole_ReturnsFilteredUsers() {
        List<AppUser> admins = List.of(
                new AppUser(3L, "admin@example.com", "adminUser", "pass", Role.ADMIN)
        );

        when(appUserRepository.findAllByRole(Role.ADMIN)).thenReturn(admins);

        List<AppUser> result = authService.getAllByRole("ADMIN");

        assertEquals(1, result.size());
        assertEquals(Role.ADMIN, result.get(0).getRole());
    }

    @Test
    void testGetAllByRole_InvalidRole_ThrowsException() {
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> authService.getAllByRole("INVALID")
        );

        assertEquals("Invalid role: INVALID", exception.getMessage());
    }

    @Test
    void testValidateToken_CallsJwtHelper() {
        String token = "mock.jwt.token";

        authService.validateToken(token);

        verify(jwtHelper).validateToken(token);
    }
}
