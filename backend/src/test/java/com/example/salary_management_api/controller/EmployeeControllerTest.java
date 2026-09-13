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
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
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
    @SuppressWarnings("unchecked")
    void testGetEmployees() {
        Employee emp = new Employee();
        emp.setFirstName("John");
        Page<Employee> page = new PageImpl<>(Collections.singletonList(emp));

        when(employeeRepository.findAll(any(Specification.class), any(PageRequest.class))).thenReturn(page);

        Page<Employee> result = employeeController.getEmployees(null, null, null, null, null, PageRequest.of(0, 10));
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

        ResponseEntity<?> response = employeeController.updateSalary(1L, updatedInfo);

        assertTrue(response.getStatusCode().is2xxSuccessful());
        Employee body = (Employee) response.getBody();
        assertNotNull(body);
        assertEquals(BigDecimal.valueOf(60000), body.getSalary());
    }

    @Test
    void testUpdateSalaryRejectsNegative() {
        Employee updatedInfo = new Employee();
        updatedInfo.setSalary(BigDecimal.valueOf(-1000));

        ResponseEntity<?> response = employeeController.updateSalary(1L, updatedInfo);

        assertTrue(response.getStatusCode().is4xxClientError());
    }

    @Test
    void testGetAnalyticsSummary() {
        when(employeeRepository.getTotalPayroll()).thenReturn(BigDecimal.valueOf(1000000));
        when(employeeRepository.getAveragePayroll()).thenReturn(BigDecimal.valueOf(50000));
        when(employeeRepository.getMedianSalary()).thenReturn(BigDecimal.valueOf(48000));
        when(employeeRepository.count()).thenReturn(20L);
        when(employeeRepository.getAnalyticsByCountry()).thenReturn(Collections.emptyList());
        when(employeeRepository.getAnalyticsByDepartment()).thenReturn(Collections.emptyList());

        AnalyticsSummaryResponse result = employeeController.getAnalyticsSummary();

        assertEquals(BigDecimal.valueOf(1000000), result.getTotalPayroll());
        assertEquals(BigDecimal.valueOf(50000), result.getAveragePayroll());
        assertEquals(BigDecimal.valueOf(48000), result.getMedianSalary());
        assertEquals(20L, result.getTotalEmployees());
    }

    @Test
    void testGetCountries() {
        when(employeeRepository.getDistinctCountries()).thenReturn(List.of("USA", "UK", "India"));

        List<String> result = employeeController.getCountries();

        assertEquals(3, result.size());
        assertTrue(result.contains("USA"));
    }
}
