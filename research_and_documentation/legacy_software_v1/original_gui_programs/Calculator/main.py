import sys
from PyQt6 import QtWidgets, QtGui
from PyQt6.QtWidgets import QMainWindow, QApplication, QMessageBox
from calculator_window import Ui_Calculator
from find_optimum_stabilizer_concentration import find_optimum_concentration2

DEFAULT_STAB_CONC = 0.2
DEFAULT_DECIMAL_PLACES = 8

class Calculator(QMainWindow, Ui_Calculator):
    def __init__(self):
        super(Calculator, self).__init__()
        self.setupUi(self)

        # Connect the calculate and clear buttons to their methods
        self.calculateButton.clicked.connect(self.calculate_optimum_concentration)
        self.clearButton.clicked.connect(self.clear_inputs)

        # Set the window icon
        self.setWindowIcon(QtGui.QIcon("calculator_icon.png"))

    def calculate_optimum_concentration(self):
        try:
            self.resultDisplay.setPlainText("")
            expected_life_time = 0
            max_stab_concentration = 0
            decimal_places = 0
            expected_life_time = self.get_float_input(self.expectedLifeTimeInput, "Expected Life Time")
            max_stab_concentration = self.get_float_input(self.maxStabConcInput, "Max Stabilizer Concentration", DEFAULT_STAB_CONC)
            decimal_places = self.get_int_input(self.decimalPlacesInput, "Decimal Places", DEFAULT_DECIMAL_PLACES)

            if expected_life_time <= 0:
                raise ValueError("Expected Life Time must be greater than 0.")
            if max_stab_concentration <= 0:
                raise ValueError("Max Stabilizer Concentration must be greater than 0.")
            if decimal_places < 0:
                raise ValueError("Decimal Places must be a non-negative integer.")

            result = find_optimum_concentration2(expected_life_time, max_stab_concentration, decimal_places)
            self.display_result(result)
        except ValueError as e:
            self.show_error(str(e))
        except Exception as e:
            self.show_error(f"An unexpected error occurred: {str(e)}")

    def get_float_input(self, input_field, field_name, default_value=None):
        text = input_field.text().strip()
        if not text:
            if default_value is not None:
                input_field.setText(str(default_value))
                return default_value
        try:
            return float(text)/2800
        except ValueError:
            raise ValueError(f"Please enter a valid number for {field_name}.")

    def get_int_input(self, input_field, field_name, default_value=None):
        text = input_field.text().strip()
        if not text:
            if default_value is not None:
                input_field.setText(str(default_value))
                return default_value
        try:
            return int(text)
        except ValueError:
            raise ValueError(f"Please enter a valid integer for {field_name}.")

    def display_result(self, result):
        if result == -1:
            message = "No need to add stabilizers."
        elif result == -2:
            message = "No suitable stabilizer (wt.%) found for this expected lifetime. Try a shorter expected lifetime or introduce another stabilizer."
        else:
            message = f"Suitable stabilizer (wt.%): {result*4}"

        message += "\n\nThank you for using.\n ~Designed by group 1~"
        self.resultDisplay.setPlainText(message)

    def clear_inputs(self):
        self.expectedLifeTimeInput.clear()
        self.maxStabConcInput.clear()
        self.decimalPlacesInput.clear()
        self.resultDisplay.clear()

    def show_error(self, error_message):
        QMessageBox.critical(self, "Error", error_message)

def apply_dark_theme(app):
    dark_theme = """
    QWidget {
        background-color: #2e2e2e;
        color: #ffffff;
        font-size: 22px;
    }
    QLineEdit, QTextEdit, QPushButton {
        background-color: #424242;
        border: 1px solid #676767;
    }
    QPushButton {
        padding: 5px;
    }
    QPushButton:hover {
        background-color: #3a3a3a;
    }
    """
    app.setStyleSheet(dark_theme)

if __name__ == "__main__":
    app = QApplication(sys.argv)
    apply_dark_theme(app)
    calculator_window = Calculator()
    calculator_window.show()
    sys.exit(app.exec())
