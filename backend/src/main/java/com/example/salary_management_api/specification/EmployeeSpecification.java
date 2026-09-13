package com.example.salary_management_api.specification;

import com.example.salary_management_api.model.Employee;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class EmployeeSpecification {

    public static Specification<Employee> withFilters(
            String search, String country, String department,
            BigDecimal minSalary, BigDecimal maxSalary) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (search != null && !search.isBlank()) {
                String pattern = "%" + search.toLowerCase() + "%";
                Predicate firstNameMatch = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("firstName")), pattern);
                Predicate lastNameMatch = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("lastName")), pattern);
                Predicate jobTitleMatch = criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("jobTitle")), pattern);
                predicates.add(criteriaBuilder.or(firstNameMatch, lastNameMatch, jobTitleMatch));
            }

            if (country != null && !country.isBlank()) {
                predicates.add(criteriaBuilder.equal(root.get("country"), country));
            }

            if (department != null && !department.isBlank()) {
                predicates.add(criteriaBuilder.equal(root.get("department"), department));
            }

            if (minSalary != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("salary"), minSalary));
            }

            if (maxSalary != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("salary"), maxSalary));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
