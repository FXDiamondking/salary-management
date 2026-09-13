package com.example.salary_management_api.service;

import com.example.salary_management_api.model.Employee;
import com.example.salary_management_api.repository.EmployeeRepository;
import net.datafaker.Faker;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;
    private final Faker faker;

    public DatabaseSeeder(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
        this.faker = new Faker();
    }

    @Override
    public void run(String... args) throws Exception {
        if (employeeRepository.count() == 0) {
            System.out.println("Seeding database with 10,000 employees...");
            List<Employee> employees = new ArrayList<>();
            for (int i = 0; i < 10000; i++) {
                Employee employee = new Employee();
                employee.setFirstName(faker.name().firstName());
                employee.setLastName(faker.name().lastName());
                employee.setJobTitle(faker.job().title());
                employee.setDepartment(faker.commerce().department());
                employee.setCountry(faker.address().country());
                
                // Random salary between 30,000 and 200,000
                double salary = faker.number().randomDouble(2, 30000, 200000);
                employee.setSalary(BigDecimal.valueOf(salary));
                employee.setCurrency("USD");
                
                employees.add(employee);
                
                // Batch save to avoid out of memory issues
                if (employees.size() >= 1000) {
                    employeeRepository.saveAll(employees);
                    employees.clear();
                }
            }
            // Save remaining
            if (!employees.isEmpty()) {
                employeeRepository.saveAll(employees);
            }
            System.out.println("Seeding complete.");
        }
    }
}
