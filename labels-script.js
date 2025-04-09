document.addEventListener('DOMContentLoaded', function () {
  const container = document.getElementById('labels-list');
  const template = document.getElementById('label-template');

  const labelsData = JSON.parse(sessionStorage.getItem('labelsData') || '[]');

  labelsData.forEach(label => {
	  console.log("parsing...");
    const clone = template.content.cloneNode(true);
	
	formattedText = "<h2>"+label.code+"</h2><p>"+label.prodname+"</p><b>Size "+label.size+"</b><p>Order No.: TEST<br>This is a test</p>";
    clone.querySelector('[data-type="contents"]').innerHTML = formattedText;

    container.appendChild(clone);
  });

  document.getElementById('global-back-to-tickets-btn').addEventListener('click', () => {
    window.location.href = 'tickets.html';
  });

  document.getElementById('global-print-labels-btn').addEventListener('click', () => {
  const printContents = document.getElementById('labels-list').innerHTML;
  const printWindow = window.open('', '', 'height=800,width=600');
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Labels</title>
        <link rel="stylesheet" href="labels-style.css">
      </head>
      <body>${printContents}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
});

});
