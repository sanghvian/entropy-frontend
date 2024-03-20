"use strict";

const canvas = document.getElementById("canvas")
// canvas.style.width  = '100%'
// canvas.style.height = '100%'

const product_list = document.getElementById("product_list")
const calibrate_button = document.getElementById("calibrate")

const ctx = canvas.getContext("2d");

// const camera_stream_port = 8765
const camera_stream_port = 9000
const camera_stream = new WebSocket(`ws://128.2.24.200:9000`)
camera_stream.addEventListener("message", async (event) => {
    const blob = new Blob([event.data], { type: "image/jpeg" })
    const image = new Image()
    image.src = URL.createObjectURL(blob)
    await image.decode() // wait for image to load

    const image_ar = image.width / image.height;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    const canvas_ar = canvas.width / canvas.height;

    var draw_width = canvas.width;
    var draw_height = canvas.height;
    if (image_ar > canvas_ar) {
        draw_height = draw_width / image_ar;
    } else {
        draw_width = draw_height * image_ar;
    }

    ctx.drawImage(image, 0, 0, draw_width, draw_height)
    URL.revokeObjectURL(image.src)
})

// const secondary_stream_port = 8766
const secondary_stream_port = 9001
const secondary_stream = new WebSocket(`ws://128.2.24.200:${secondary_stream_port}`)
secondary_stream.addEventListener("message", async (event) => {
    if (event.data == "calibration error") {
        alert("Calibration failed!")
        return
    }
    const inference = JSON.parse(event.data)
    product_list.innerHTML =
        inference.map(item => {
            const image = new Image()
            image.src = item.matched_img
            image.class = "card-img"
            image.style.height = "100%"
            image.style.width = "100%"
            image.style.objectFit = "contain"
            return `
            <div class="card mb-3">
                <div class="row no-gutters">
                <div class="col-md-4">
                    ${image.outerHTML}
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                    <h5 class="card-title">Product</h5>
                    <p class="card-text">${item.upc}</p>
                    <p class="card-text"><strong>Price: $19.99</strong></p>
                    <button class="btn btn-danger">Remove</button>
                    </div>
                </div>
                </div>
            </div>
        `
        }).join('');
})

calibrate_button.onclick = function () {
    secondary_stream.send("calibrate")   // alert('click!')
}