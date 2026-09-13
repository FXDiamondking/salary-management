package com.example.salary_management_api.controller;

import com.example.salary_management_api.dto.AnalyticsSummaryResponse;
import com.example.salary_management_api.model.Employee;
import com.example.salary_management_api.repository.EmployeeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // For development convenience
public class EmployeeController {

    private final EmployeeRepository employeeRepository;

    public EmployeeController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @GetMapping("/employees")
    public Page<Employee> getEmployees(Pageable pageable) {
        return employeeRepository.findAll(pageable);
    }

    @GetMapping("/employees/{id}")
    public ResponseEntity<Employee> getEmployee(@PathVariable Long id) {
        return employeeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/employees/{id}/salary")
    public ResponseEntity<Employee> updateSalary(@PathVariable Long id, @RequestBody Employee salaryUpdate) {
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
                employeeRepository.getAnalyticsByCountry(),
                employeeRepository.getAnalyticsByDepartment()
        );
    }
}
