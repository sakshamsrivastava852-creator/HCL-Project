package com.hcl.harvest.hub.entity;

public class User {

    private Long id;
    private String name;
    private String role;
    private String username;
    private String email;
    private String status;
    private String application;

    public User() {
    }

    public User(Long id, String name, String role, String username, String email, String status, String application) {
        this.id = id;
        this.name = name;
        this.role = role;
        this.username = username;
        this.email = email;
        this.status = status;
        this.application = application;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getApplication() {
        return application;
    }

    public void setApplication(String application) {
        this.application = application;
    }
}
