from PyQt6 import QtCore, QtGui, QtWidgets

class Ui_Calculator(object):
    def setupUi(self, Calculator):
        Calculator.setObjectName("Calculator")
        Calculator.resize(720, 480)
        self.centralwidget = QtWidgets.QWidget(parent=Calculator)
        self.centralwidget.setObjectName("centralwidget")
        self.verticalLayout = QtWidgets.QVBoxLayout(self.centralwidget)
        self.verticalLayout.setObjectName("verticalLayout")

        self.expectedLifeTimeInput = QtWidgets.QLineEdit(parent=self.centralwidget)
        self.expectedLifeTimeInput.setObjectName("expectedLifeTimeInput")
        self.expectedLifeTimeInput.setToolTip("Enter the expected lifetime in hours")
        self.verticalLayout.addWidget(self.expectedLifeTimeInput)

        self.maxStabConcInput = QtWidgets.QLineEdit(parent=self.centralwidget)
        self.maxStabConcInput.setObjectName("maxStabConcInput")
        self.maxStabConcInput.setToolTip("Enter the maximum stabilizer concentration (default 0.2)")
        self.verticalLayout.addWidget(self.maxStabConcInput)

        self.decimalPlacesInput = QtWidgets.QLineEdit(parent=self.centralwidget)
        self.decimalPlacesInput.setObjectName("decimalPlacesInput")
        self.decimalPlacesInput.setToolTip("Enter the number of decimal places for the result")
        self.verticalLayout.addWidget(self.decimalPlacesInput)

        self.resultDisplay = QtWidgets.QTextEdit(parent=self.centralwidget)
        self.resultDisplay.setObjectName("resultDisplay")
        self.verticalLayout.addWidget(self.resultDisplay)

        self.calculateButton = QtWidgets.QPushButton(parent=self.centralwidget)
        self.calculateButton.setObjectName("calculateButton")
        self.verticalLayout.addWidget(self.calculateButton)

        self.clearButton = QtWidgets.QPushButton(parent=self.centralwidget)
        self.clearButton.setObjectName("clearButton")
        self.verticalLayout.addWidget(self.clearButton)

        Calculator.setCentralWidget(self.centralwidget)

        self.retranslateUi(Calculator)
        QtCore.QMetaObject.connectSlotsByName(Calculator)

    def retranslateUi(self, Calculator):
        _translate = QtCore.QCoreApplication.translate
        Calculator.setWindowTitle(_translate("Calculator", "Stabilizer Amount Predictor"))
        self.expectedLifeTimeInput.setPlaceholderText(_translate("Calculator", "Expected Life Time (hours)"))
        self.maxStabConcInput.setPlaceholderText(_translate("Calculator", "Max Stabilizer Concentration (default 0.2)"))
        self.decimalPlacesInput.setPlaceholderText(_translate("Calculator", "Decimal Places"))
        self.calculateButton.setText(_translate("Calculator", "Calculate"))
        self.clearButton.setText(_translate("Calculator", "Clear"))
