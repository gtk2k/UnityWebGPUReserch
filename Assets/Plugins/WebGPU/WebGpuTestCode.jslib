var WebGpuTestCode = {
    $managedObjects: {
        cnv: null,
        ctx: null,
        imageData: null,
    },

    InitCanvas: function(width, height) {
        var cnv = document.createElement('canvas');
        cnv.width = width;
        cnv.height = height;
        var ctx = cnv.getContext('2d');
        cnv.style.position = 'absolute';
        cnv.style.left = cnv.style.top = 0;
        var imageData = ctx.createImageData(width, height);
        document.documentElement.appendChild(cnv);
        managedObjects.cnv = cnv;
        managedObjects.ctx = ctx;
        managedObjects.imageData = imageData;
    },

    GetNativePixcelData: function (width, height, texPtr) {
        var texture = Module.WebGPU.device.derivedObjects.get(texPtr);
        var device = Module.WebGPU.device;
        var commandEncoder = device.createCommandEncoder();
        var buffer = device.createBuffer({
            size: width * height * 4,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
        });
        commandEncoder.copyTextureToBuffer(
            { texture },
            { buffer },
            { width, height }
        );
        device.queue.submit([commandEncoder.finish()]);
        buffer.mapAsync(GPUMapMode.READ).then(function () {
            var arrayBuffer = buffer.getMappedRange();
            managedObjects.imageData.data.set(arrayBuffer);
            managedObjects.ctx.putImageData(managedObjects.imageData, 0, 0);
            buffer.unmap();
            buffer.destroy();
            arrayBuffer = null;
        });
    }
};

autoAddDeps(WebGpuTestCode, '$managedObjects');
mergeInto(LibraryManager.library, WebGpuTestCode);