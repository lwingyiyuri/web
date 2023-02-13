<div class="planetInfo">
        <div class="top">
            <div class="head" id="head"> SPATIAL SYSTEMS INFORMATION</div>
            <div class="properties" id="properties">Select a planet to start</div>
        </div>
        <div class="buttons">
            <button id="button">VISIT NEXT SYSTEM</button>
        </div>
    </div>
    <canvas class="webgl"></canvas>
        
    <style>
    	@import url("https://fonts.googleapis.com/css2?family=Monda&display=swap");

* {
  margin: 0;
  padding: 0;
}

*,
*:before,
*:after {
  box-sizing: border-box;
}

html,
body {
  font-family: "Monda", sans-serif;
  overflow: hidden;
  background-color: #000000;
  opacity: 1;
  background-color: #000000;
  opacity: 1;
  background-image: linear-gradient(#45f7513d 1px, transparent 1px),
    linear-gradient(to right, #45f75121 1px, #000000 1px);
  background-size: 80px 80px;
}

.webgl {
  position: fixed;
  top: 0;
  left: 0;
  outline: none;
}

.planetInfo {
  padding: 10px;
  position: fixed;
  top: 100px;
  left: 40px;
  background-color: black;
  min-width: 320px;
  min-height: 400px;
  border: solid 1px #00ff00;
  color: #00ff00;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.head,
.properties {
  padding: 10px;
  width: 100%;
  display: flex;
  text-transform: uppercase;
}

.head {
  justify-content: center;
  align-items: center;
  border-bottom: solid 1px #00ff00;
}

.properties {
  flex-direction: column;
  height: 80%;
}

button {
  width: 100%;
  padding: 10px;
  background-color: black;
  color: #00ff00;
  border: solid 1px #00ff00;
  transition: all 0.3s ease-out;
  cursor: pointer;
  outline: none;
}

button:hover {
  background-color: #00ff00;
  color: black;
}

    	</style>

    <script  src="https://drive.google.com/uc?id=1-_urYSWEQ2ygEUItuNZyZrGZs5MdwZx2"></script>
