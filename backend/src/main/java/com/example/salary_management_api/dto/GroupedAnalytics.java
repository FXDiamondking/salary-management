package com.example.salary_management_api.dto;

import java.math.BigDecimal;

public interface GroupedAnalytics {
    String getGroupName();
    BigDecimal getAverageSalary();
    BigDecimal getTotalSalary();
    Long getEmployeeCount();
}
