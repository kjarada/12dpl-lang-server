// 12dPL Comprehensive Test File
// Demonstrating advanced language features, types, and syntax

// 1. Preprocessing
#include "std_library.h" // Hypothetical include

// 2. Function Prototypes
Integer factorial(Integer n);
void swap(Integer &a, Integer &b); // Pass by reference
void process_array(Real values[], Integer size); // Array argument
Real calculate_magnitude(Vector3 v);

// 3. User Defined Functions

// Recursive function
Integer factorial(Integer n) {
    return n < 2 ? 1 : n * factorial(n - 1);
}

// Pass by reference
void swap(Integer &a, Integer &b) {
    Integer temp = a;
    a = b;
    b = temp;
}

// Array handling
void process_array(Real values[], Integer size) {
    Integer i;
    for (i = 0; i < size; i++) {
        values[i] *= 2.0; // Assignment operator
    }
}

// Overloading example
void print_value(Integer val) {
    // Print integer
}

void print_value(Real val) {
    // Print real
}

// 4. Main Entry Point
void main() {
    // --- Constants & Types ---
    Integer     i_val = 123;
    Integer64   l_val = 9876543210LL; // 64-bit suffix
    Real        r_val = 1.0e+2;       // Scientific notation
    Real        r_dot = 6.;           // Trailing dot
    Text        msg   = "Hello\n\"World\"";
    
    // --- 12d Model Types ---
    Element     elt;
    Model       model;
    Tin         tin;
    View        view;
    Uid         uid;
    Guid        guid;
    Attributes  attr;
    
    // --- Geometric Types ---
    Point       pt;
    Line        ln;
    Arc         arc;
    Spiral      spi;
    Segment     seg;
    
    // --- Math Types ---
    Vector3     v3;
    Matrix4     mat;
    
    // --- Interface Types ---
    Panel       panel;
    Button      btn;
    Input_Box   ibox;
    
    // --- Arrays ---
    Real        data_array[10];
    Dynamic_Text text_list;
    
    Integer bitwise;
    Integer logical;

    // --- Operators ---
    i_val += 10;
    i_val++;
    bitwise = (i_val & 0xFF) | 0x0F;
    logical = (i_val > 100) && (r_val < 500.0);
    
    // --- Flow Control: Switch ---
    switch (i_val) {
        case 1: {
            print_value(1);
            break;
        }
        case 100: {
            print_value(100);
            // Fallthrough logic if needed, but usually break
            break;
        }
        default: {
            print_value(0);
        }
    }
    
    // --- Flow Control: Loops ---
    Integer k;
    k = 0;
    do {
        k++;
        if (k == 5) continue;
    } while (k < 10);
    
    // --- Function Calls ---
    swap(i_val, k);
    
    data_array[0] = 1.5;
    data_array[1] = 2.5;
    process_array(data_array, 2);
    
    Integer fact;
    fact = factorial(5);
    
    // --- 12d Model Function Calls ---
    Text elt_name;
    Get_name(elt, elt_name);
    
    Text model_name;
    Get_name(model, model_name);

    // --- Goto ---
    if (fact > 1000) goto error_label;
    
    return;

error_label:
    // Error handling code
    return;
}
