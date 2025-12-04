using System;
using System.Runtime.InteropServices;
using UnityEngine;
using UnityEngine.UI;

public class WebGPUCheckLib : MonoBehaviour
{
    [DllImport("__Internal")]
    private static extern void InitCanvas(int width, int height);
    [DllImport("__Internal")]
    private static extern void GetNativePixelData(int width, int height, int texPtr);

    [SerializeField] private Camera _captureCamera;
    [SerializeField] private RawImage _preview;
    [SerializeField] private Transform _cube;
    [SerializeField] private int _width = 640;
    [SerializeField] private int _height = 360;

    private RenderTexture _rt;
    private IntPtr _rtPtr;

    private void Start()
    {
        _rt = new RenderTexture(_width, _height, 24, RenderTextureFormat.ARGB32, 0);
        _ = _rt.colorBuffer;
        _rtPtr = _rt.GetNativeTexturePtr();
        _captureCamera.targetTexture = _rt;
        _preview.texture = _rt;
        InitCanvas(_width, _height);
    }

    private void Update()
    {
        GetNativePixelData(_width, _height, (int)_rtPtr);
        _cube.Rotate(0.1f, 0.2f, 0.5f);
    }
}
