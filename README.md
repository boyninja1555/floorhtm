<div align="center">
    <h1>FloorHTM</h1>
</div>

You hate HTML. I hate HTML. You hate frameworks. I hate frameworks. What if we took the only good parts we use in frameworks, and jam them into one lightweight preprocessor? **FloorHTM** does exactly that!

**Components**  
Everybody loves components. Why should you **not** split your pages into separate files? It's clean, and you don't cry yourself to sleep every 3 lines.
```html
<component src="stupid" />  <!-- Points to "./stupid.html" or "./stupid.fhtm" (HTML takes priorty) -->
```

**Server scripts**  
If you don't use server scripts, you're wasting your time. This code is JavaScript that runs while you're building the site! Do not mix this up with another type of server code which runs every time a user visits.
```html
<script type="server">
    console.log("IM BUILDING")
</script>
```

**Server scripts | variables**  
How useful is server code if you can't display the results? FloorHTM lets you access variables **anywhere** inside the document! However, these cannot contain expressions or code of any type for code organization.
```html
<script type="server">
    client.year = new Date().getFullYear()   <!-- Think of `client` as a record/object that can be indexed in placeholders -->
</script>
<h1>The year is {{%year%}}</h1>
```

**Cleanup**  
We all write horrible "code". FloorHTM takes advantage of the random HTML library and makes your document look like a normal person wrote it! It can automatically insert tags like `<body>`, close self-closing tags, and hide your "inner" monster.
