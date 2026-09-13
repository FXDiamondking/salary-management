package com.example.salary_management_api.dto;

import java.math.BigDecimal;
import java.util.List;
import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class AnalyticsSummaryResponse {
    private BigDecimal totalPayroll;
    private BigDecimal averagePayroll;
    private BigDecimal medianSalary;
    private long totalEmployees;
    private List<GroupedAnalytics> byCountry;
    private List<GroupedAnalytics> byDepartment;
}
