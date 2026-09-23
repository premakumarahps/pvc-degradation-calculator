"""
Theory & Mathematical Models Tab.
Presents the scientific background, reaction mechanisms, ODEs, and literature references.
"""

from PyQt6.QtWidgets import QWidget, QVBoxLayout, QTextBrowser


THEORY_HTML = """
<!DOCTYPE html>
<html>
<head>
<style>
    body {
        font-family: 'Segoe UI', Arial, sans-serif;
        color: #e2e8f0;
        background-color: #0b0f19;
        line-height: 1.6;
        padding: 16px;
    }
    h1, h2, h3 {
        color: #38bdf8;
        border-bottom: 1px solid #1e293b;
        padding-bottom: 6px;
    }
    h1 { font-size: 22px; }
    h2 { font-size: 17px; margin-top: 20px; color: #7dd3fc; }
    h3 { font-size: 14px; color: #a5f3fc; }
    code, pre {
        background-color: #0f172a;
        color: #38bdf8;
        border: 1px solid #1e293b;
        border-radius: 4px;
        padding: 2px 6px;
        font-family: Consolas, monospace;
    }
    pre {
        padding: 12px;
        overflow-x: auto;
    }
    .highlight-card {
        background-color: #0f172a;
        border-left: 4px solid #38bdf8;
        padding: 12px;
        border-radius: 4px;
        margin: 12px 0;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        margin: 14px 0;
    }
    th, td {
        border: 1px solid #233554;
        padding: 8px 12px;
        text-align: left;
    }
    th {
        background-color: #1e293b;
        color: #38bdf8;
    }
    tr:nth-child(even) {
        background-color: #0d1526;
    }
    .badge {
        display: inline-block;
        background-color: #0284c7;
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: bold;
    }
</style>
</head>
<body>

<h1>Poly(vinyl chloride) UV Degradation & HALS Stabilization Modeling</h1>

<div class="highlight-card">
    <b>Research Focus:</b> Degradation Kinetic Modeling and Prediction of Optimal HALS Amount for Effective UV Stabilization of PVC.<br>
    <b>Model System:</b> Rigid PVC Matrix stabilized with Tinuvin 770 (Bis(2,2,6,6-tetramethyl-4-piperidyl) sebacate).
</div>

<h2>1. Photodegradation Chemistry of PVC</h2>
<p>
Polyvinyl Chloride (PVC) undergoes rapid chemical and physical deterioration when exposed to solar UV radiation. 
The primary degradation mechanism is free-radical auto-oxidation coupled with dehydrochlorination:
</p>
<ul>
    <li><b>Photolytic Initiation:</b> UV photons induce homolytic cleavage of labile C-Cl bonds, generating chlorine radicals (<code>Cl*</code>) and polymer alkyl radicals (<code>R*</code>).</li>
    <li><b>Dehydrochlorination & Zip-Elimination:</b> Consecutive loss of hydrogen chloride (HCl) forms conjugated polyene sequences (<code>-(CH=CH)n-</code>), causing severe yellow-brown discoloration and surface embrittlement.</li>
    <li><b>Auto-oxidation Chain:</b> Polymer alkyl radicals (<code>R*</code>) rapidly react with dissolved oxygen (k7 = 1.0 &times; 10<sup>8</sup> M<sup>-1</sup>s<sup>-1</sup>) to form degradative peroxy radicals (<code>ROO*</code>).</li>
</ul>

<h2>2. Denisov Regenerative Cycle (HALS Action)</h2>
<p>
Hindered Amine Light Stabilizers (HALS) like Tinuvin 770 protect PVC not by filtering UV light, but by chemically intercepting destructive free radicals through the catalytic <b>Denisov Cycle</b>:
</p>
<ol>
    <li><b>Peroxy Radical Scavenging:</b> Hindered amine groups (<code>>NH</code>) react with peroxy radicals (<code>ROO*</code>) to produce hydroxylamines (<code>>N-OH</code>).</li>
    <li><b>Radical Recombination:</b> Intermediate nitroxyl radicals (<code>>NO*</code>) trap polymer alkyl radicals (<code>R*</code>) at near diffusion-controlled rates (k3 = 1.2 &times; 10<sup>9</sup> M<sup>-1</sup>s<sup>-1</sup>), forming alkoxyamines (<code>>N-O-R</code>).</li>
    <li><b>Catalytic Regeneration:</b> Alkoxyamines react with further peroxy radicals or undergo thermal cleavage to regenerate the active nitroxyl radical (<code>>NO*</code>), allowing one HALS molecule to neutralize dozens of radical chains!</li>
</ol>

<h2>3. Coupled Stiff Kinetic Equations (8 ODEs)</h2>
<pre>
1. d[PVC]/dt    = - k6*[PVC] - k8*[PVC]*[ROO*] - k9*[Cl*]*[PVC]
2. d[>NH]/dt    = - k1*[ROO*]*[>NH]
3. d[Cl*]/dt    =   k6*[PVC] + k8*[PVC]*[ROO*]
4. d[>N-OH]/dt  =   k1*[ROO*]*[>NH] + k5*[>NOR] - k2*[>N-OH]*[ROO*]
5. d[>NOR]/dt   =   k3*[>NO*]*[R*] - k5*[>NOR] - k4*[>NOR]*[ROO*]
6. d[>NO*]/dt   =   k4*[>NOR]*[ROO*] + k2*[ROO*]*[>N-OH] - k3*[R*]*[>NO*]
7. d[R*]/dt     =   k6*[PVC] - k7*[R*] - k3*[R*]*[>NO*]
8. d[ROO*]/dt   =   k7*[R*] - k8*[ROO*]*[PVC] - k1*[ROO*]*[>NH] - k2*[ROO*]*[>N-OH] - k4*[>NOR]*[ROO*]
</pre>

<h2>4. Reaction Rate Constants</h2>
<table>
    <tr>
        <th>Constant</th>
        <th>Value</th>
        <th>Reaction Step</th>
    </tr>
    <tr>
        <td><b>k1</b></td>
        <td>51.0 M<sup>-1</sup> s<sup>-1</sup></td>
        <td>ROO* + >NH &rarr; >NOH + inactive products</td>
    </tr>
    <tr>
        <td><b>k2</b></td>
        <td>550.0 M<sup>-1</sup> s<sup>-1</sup></td>
        <td>ROO* + >NOH &rarr; >NO* + ROOH</td>
    </tr>
    <tr>
        <td><b>k3</b></td>
        <td>1.2 &times; 10<sup>9</sup> M<sup>-1</sup> s<sup>-1</sup></td>
        <td>>NO* + R* &rarr; >NOR (Alkyl radical termination)</td>
    </tr>
    <tr>
        <td><b>k4</b></td>
        <td>1.9 &times; 10<sup>-3</sup> M<sup>-1</sup> s<sup>-1</sup></td>
        <td>>NOR + ROO* &rarr; >NO* + ROOR</td>
    </tr>
    <tr>
        <td><b>k5</b></td>
        <td>9.3 &times; 10<sup>-5</sup> s<sup>-1</sup></td>
        <td>>NOR &rarr; >NOH + alkene cleavage</td>
    </tr>
    <tr>
        <td><b>k6</b></td>
        <td>1.0 &times; 10<sup>-6</sup> s<sup>-1</sup></td>
        <td>PVC + h&nu; &rarr; R* + Cl* (UV photolysis initiation)</td>
    </tr>
    <tr>
        <td><b>k7</b></td>
        <td>1.0 &times; 10<sup>8</sup> M<sup>-1</sup> s<sup>-1</sup></td>
        <td>R* + O2 &rarr; ROO* (Rapid oxygen addition)</td>
    </tr>
    <tr>
        <td><b>k8</b></td>
        <td>0.5 M<sup>-1</sup> s<sup>-1</sup></td>
        <td>ROO* + PVC &rarr; R* + Cl* (Chain propagation)</td>
    </tr>
    <tr>
        <td><b>k9</b></td>
        <td>0.1 M<sup>-1</sup> s<sup>-1</sup></td>
        <td>Cl* + PVC &rarr; R* + HCl (Autocatalytic propagation)</td>
    </tr>
</table>

<h2>5. References & Academic Attribution</h2>
<ol>
    <li>Andrady, A. L., Hamid, S. A., & Lambert, M. P. (2005). Effects of sunlight on polymers: degradation and stabilization. <i>Handbook of Material Weathering</i>.</li>
    <li>Ohkatsu, Y. (2008). Search for Unified Action Mechanism of Hindered Amine Light Stabilizers. <i>J. Jpn. Pet. Inst.</i>, 51(4), 191-204.</li>
    <li>Asua, J. M., Lezcano, P. M., & Marco, C. (2002). Kinetic modeling of the photostabilization of PVC by HALS. <i>Polymer Degradation and Stability</i>, 75(2), 225-239.</li>
    <li>Singh, B., Byrne, F., & Morrison, M. (2017). Degradation of polyvinyl chloride (PVC) formulations: A review. <i>Polymer Degradation and Stability</i>, 138, 115-124.</li>
</ol>

</body>
</html>
"""


class TheoryTab(QWidget):
    def __init__(self, parent=None):
        super().__init__(parent)
        layout = QVBoxLayout(self)
        layout.setContentsMargins(16, 16, 16, 16)

        browser = QTextBrowser()
        browser.setOpenExternalLinks(True)
        browser.setHtml(THEORY_HTML)
        layout.addWidget(browser)
