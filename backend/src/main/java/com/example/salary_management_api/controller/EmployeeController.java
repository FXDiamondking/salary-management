package com.example.salary_management_api.controller;

import com.example.salary_management_api.dto.AnalyticsSummaryResponse;
import com.example.salary_management_api.model.Employee;
import com.example.salary_management_api.repository.EmployeeRepository;
import com.example.salary_management_api.specification.EmployeeSpecification;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // For development convenience
public class EmployeeController {

    private final EmployeeRepository employeeRepository;

    public EmployeeController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @GetMapping("/employees")
    public Page<Employee> getEmployees(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) BigDecimal minSalary,
            @RequestParam(required = false) BigDecimal maxSalary,
            Pageable pageable) {
        Specification<Employee> spec = EmployeeSpecification.withFilters(
                search, country, department, minSalary, maxSalary);
        return employeeRepository.findAll(spec, pageable);
    }

    @GetMapping("/employees/{id}")
    public ResponseEntity<Employee> getEmployee(@PathVariable Long id) {
        return employeeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/employees/{id}/salary")
    public ResponseEntity<?> updateSalary(@PathVariable Long id, @Valid @RequestBody Employee salaryUpdate) {
        if (salaryUpdate.getSalary() == null || salaryUpdate.getSalary().compareTo(BigDecimal.ZERO) < 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Salary must be a non-negative number"));
        }
        return employeeRepository.findById(id).map(employee -> {
            employee.setSalary(salaryUpdate.getSalary());
            if (salaryUpdate.getCurrency() != null) {
                employee.setCurrency(salaryUpdate.getCurrency());
            }
            return ResponseEntity.ok(employeeRepository.save(employee));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/analytics/summary")
    public AnalyticsSummaryResponse getAnalyticsSummary() {
        return new AnalyticsSummaryResponse(
                employeeRepository.getTotalPayroll(),
                employeeRepository.getAveragePayroll(),
                employeeRepository.getMedianSalary(),
                employeeRepository.count(),
                employeeRepository.getAnalyticsByCountry(),
                employeeRepository.getAnalyticsByDepartment()
        );
    }

    @GetMapping("/filters/countries")
    public List<String> getCountries() {
        return employeeRepository.getDistinctCountries();
    }

    @GetMapping("/filters/departments")
    public List<String> getDepartments() {
        return employeeRepository.getDistinctDepartments();
    }
}
