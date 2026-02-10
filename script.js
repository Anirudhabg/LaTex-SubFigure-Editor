function toggleDark() {
    document.body.classList.toggle("dark");
}

function createInputs() {
    const count = document.getElementById("imgCount").value;
    const area = document.getElementById("uploadArea");
    area.innerHTML = "";

    for (let i = 1; i <= count; i++) {
        const div = document.createElement("div");
        div.className = "dropzone";
        div.innerHTML = `
      <b>Image ${i}</b><br>
      <input type="file" id="img${i}" accept=".png,.jpg,.jpeg"><br>
      Caption: <input type="text" id="cap${i}"><br>
    `;

        // Drag & Drop
        div.ondragover = e => e.preventDefault();
        div.ondrop = e => {
            e.preventDefault();
            document.getElementById(`img${i}`).files = e.dataTransfer.files;
        };

        area.appendChild(div);
    }
}

function generateCode() {
    const count = document.getElementById("imgCount").value;
    const perRow = document.getElementById("rowSelect").value;

    let width = "0.48";
    if (perRow == 3) width = "0.30";
    if (perRow == 4) width = "0.22";

    let code = "% Add in preamble\n% \\usepackage{subcaption}\n\n";
    code += "\\begin{figure}[h]\n\\centering\n";

    for (let i = 1; i <= count; i++) {
        const file = document.getElementById(`img${i}`).files[0];
        const cap = document.getElementById(`cap${i}`).value || "Image";

        // Use the file name (without extension) as the label
        let label = file ? file.name.split('.').slice(0, -1).join('.') : `fig:sub${i}`;

        code += `\\begin{subfigure}{${width}\\textwidth}\n`;
        code += `\\includegraphics[width=\\linewidth]{${file ? file.name : ""}}\n`;
        code += `\\caption{${cap}}\n`;
        code += `\\label{fig:${label}}\n`;
        code += `\\end{subfigure}\n`;

        if (i % perRow !== 0 && i != count) {
            code += "\\hfill\n";
        } else {
            code += "\n";
        }
    }

    const mainCap = document.getElementById("mainCaption").value || "Main Caption";
    const mainLabel = "fig:main"; // optional, can keep as default

    code += `\\caption{${mainCap}}\n`;
    code += `\\label{${mainLabel}}\n`;
    code += "\\end{figure}";

    document.getElementById("output").value = code;
}



function copyCode() {
    const t = document.getElementById("output");
    t.select();
    document.execCommand("copy");
}

function downloadTex() {
    const content = document.getElementById("output").value;
    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "subfigure.tex";
    a.click();
}
