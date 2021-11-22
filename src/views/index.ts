const index = (): string => ` 
<!DOCTYPE html>
<html>
   <body>
      <h1>URL shortener</h1>
      <form action="/" method="post">
            <label for="url">Type the url you want to shorten</label>
            <input name="url" id="url" placeholder="example.com" minlength="5">
            <button type="submit">Short</button>
      </form>
   </body>
</html>`

export default index
