// 12dPL Comprehensive Test File
// This file demonstrates all major language features

#define DEBUG_MODE

// ============================================================================
// FUNCTION DEFINITIONS
// ============================================================================

Integer calculate_sum(Integer a, Integer b)
{
    return a + b;
}

Real calculate_distance(Real x1, Real y1, Real x2, Real y2)
{
    Real dx = x2 - x1;
    Real dy = y2 - y1;
    return dx * dx + dy * dy;
}

// ============================================================================
// MAIN ENTRY POINT
// ============================================================================

void main()
{
    // Basic types
    Integer count = 42;
    Real pi = 3.14159;
    Text name = "12dPL";
    
    // Geometric types
    Point p1;
    Line line;
    Element elem;
    Model current_model;
    
    // Arrays
    Dynamic_Integer numbers;
    Dynamic_Text names;
    
    // Test function calls
    Integer sum = calculate_sum(10, 20);
    
    // Control flow - if statement
    if (count > 10)
    {
        count = count + 1;
    }
    else
    {
        count = count - 1;
    }
    
    // Control flow - while loop
    Integer i = 0;
    while (i < 10)
    {
        i = i + 1;
    }
    
    // Control flow - for loop
    Integer j;
    for (j = 0; j < 5; j = j + 1)
    {
        count = count + j;
    }
    
    // Control flow - switch statement
    switch (count)
    {
        case 1:
        {
            count = 100;
            break;
        }
        case 2:
        {
            count = 200;
            break;
        }
        default:
        {
            count = 0;
        }
    }
    
    // Operators
    Integer a = 10;
    Integer b = 3;
    Integer result = a + b;
    result = a - b;
    result = a * b;
    result = a / b;
    
    // Comparison
    if (a > b)
    {
        result = 1;
    }
    
    if (a == b)
    {
        result = 0;
    }
}