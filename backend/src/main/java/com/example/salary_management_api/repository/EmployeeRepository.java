package com.example.salary_management_api.repository;

import com.example.salary_management_api.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.Query;
import com.example.salary_management_api.dto.GroupedAnalytics;
import java.util.List;
import java.math.BigDecimal;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    
    @Query("SELECT e.country AS groupName, AVG(e.salary) AS averageSalary, SUM(e.salary) AS totalSalary, COUNT(e) AS employeeCount FROM Employee e GROUP BY e.country")
    List<GroupedAnalytics> getAnalyticsByCountry();

    @Query("SELECT e.department AS groupName, AVG(e.salary) AS averageSalary, SUM(e.salary) AS totalSalary, COUNT(e) AS employeeCount FROM Employee e GROUP BY e.department")
    List<GroupedAnalytics> getAnalyticsByDepartment();
    
    @Query("SELECT SUM(e.salary) FROM Employee e")
    BigDecimal getTotalPayroll();
    
    @Query("SELECT AVG(e.salary) FROM Employee e")
    BigDecimal getAveragePayroll();
}
