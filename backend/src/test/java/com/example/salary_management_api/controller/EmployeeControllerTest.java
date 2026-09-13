package com.example.salary_management_api.controller;

import com.example.salary_management_api.dto.AnalyticsSummaryResponse;
import com.example.salary_management_api.model.Employee;
import com.example.salary_management_api.repository.EmployeeRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class EmployeeControllerTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeController employeeController;

    @Test
    void testGetEmployees() {
        Employee emp = new Employee();
        emp.setFirstName("John");
        Page<Employee> page = new PageImpl<>(Collections.singletonList(emp));
        
        when(employeeRepository.findAll(any(PageRequest.class))).thenReturn(page);

        Page<Employee> result = employeeController.getEmployees(PageRequest.of(0, 10));
        assertEquals(1, result.getContent().size());
        assertEquals("John", result.getContent().get(0).getFirstName());
    }

    @Test
    void testUpdateSalary() {
        Employee emp = new Employee();
        emp.setId(1L);
        emp.setSalary(BigDecimal.valueOf(50000));

        Employee updatedInfo = new Employee();
        updatedInfo.setSalary(BigDecimal.valueOf(60000));

        when(employeeRepository.findById(1L)).thenReturn(Optional.of(emp));
        when(employeeRepository.save(any(Employee.class))).thenReturn(emp);

        var response = employeeController.updateSalary(1L, updatedInfo);
        
        assertTrue(response.getStatusCode().is2xxSuccessful());
        assertEquals(BigDecimal.valueOf(60000), response.getBody().getSalary());
    }
}
