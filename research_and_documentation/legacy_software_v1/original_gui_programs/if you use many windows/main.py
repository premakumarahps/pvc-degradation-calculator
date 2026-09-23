import sys
from PyQt6 import QtWidgets, QtCore, uic
from PyQt6.QtWidgets import QMessageBox
from main_window import Ui_MainWindow
from calculator_mode import Ui_CalculatorMode
from analysis_mode import Ui_AnalysisMode
from pvc_degrade_prof_simulator import PVC_deg_prof
from find_optimum_stabilizer_concentration import find_optimum_concentration1, find_optimum_concentration2
from pvc_degradation_analysis import degrade_analyse

class MainWindow(QtWidgets.QMainWindow, Ui_MainWindow):
    def __init__(self):
        super(MainWindow, self).__init__()
        self.setupUi(self)

        # Connect buttons to their respective methods
        self.calculatorModeButton.clicked.connect(self.open_calculator_mode)
        self.analysisModeButton.clicked.connect(self.open_analysis_mode)

    def open_calculator_mode(self):
        self.calculator_window = CalculatorMode()
        self.calculator_window.show()

    def open_analysis_mode(self):
        self.analysis_window = AnalysisMode()
        self.analysis_window.show()

class CalculatorMode(QtWidgets.QMainWindow, Ui_CalculatorMode):
    def __init__(self):
        super(CalculatorMode, self).__init__()
        self.setupUi(self)

        # Connect the calculate button to the method
        self.calculateButton.clicked.connect(self.calculate_optimum_concentration)

    def calculate_optimum_concentration(self):
        try:
            self.resultDisplay.setPlainText("")
            expected_life_time = float(self.expectedLifeTimeInput.text())
            max_stab_concentration = float(self.maxStabConcInput.text())
            decimal_places = int(self.decimalPlacesInput.text())
            result = find_optimum_concentration2(expected_life_time, max_stab_concentration, decimal_places)
            self.display_result(result)
        except Exception as e:
            self.show_error(str(e))

    def display_result(self, result):
        if result == -1:
            message = "No need to add stabilizer."
        elif result == -2:
            message = "No suitable stabilizer concentration found for this expected lifetime. Try shorter expected lifetime or introduce another stabilizer."
        else:
            message = f"Suitable stabilizer concentration: {result}"

        message+="\n\nThank for using.\n ~created by sandun~"
        self.resultDisplay.setPlainText(message)

    def show_error(self, error_message):
        QMessageBox.critical(self, "Error", error_message)

class AnalysisMode(QtWidgets.QMainWindow, Ui_AnalysisMode):
    def __init__(self):
        super(AnalysisMode, self).__init__()
        self.setupUi(self)

        # Connect the save button to the method
        self.saveButton.clicked.connect(self.run_degrade_analyse)

    def run_degrade_analyse(self):
        try:
            QMessageBox.information(self, "Calculating", "Please wait...")
            degrade_time_in_hours = float(self.degradeTimeInput.text())
            file_name = self.fileNameInput.text()
            max_stab_concentration = float(self.maxStabConcInput.text())
            degrade_analyse(degrade_time_in_hours, file_name, max_stab_concentration)
            self.show_message(f"Degradation analysis saved to {file_name}.xlsx")
        except Exception as e:
            self.show_error(str(e))

    def show_message(self, message):
        QMessageBox.information(self, "Result", message)

    def show_error(self, error_message):
        QMessageBox.critical(self, "Error", error_message)

def apply_dark_theme(app):
    dark_theme = """
    QWidget {
        background-color: #2e2e2e;
        color: #ffffff;
        font-size: 14px;
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
    app = QtWidgets.QApplication(sys.argv)
    apply_dark_theme(app)
    main_window = MainWindow()
    main_window.show()
    sys.exit(app.exec())
