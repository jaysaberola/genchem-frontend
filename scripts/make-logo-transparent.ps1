Add-Type -AssemblyName System.Drawing

$src = Join-Path $PSScriptRoot "..\public\images\logos\genchemph-logo.png"
$out = Join-Path $PSScriptRoot "..\public\images\logos\genchemph-logo-transparent.png"

$bmp = New-Object System.Drawing.Bitmap($src)
$result = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($x = 0; $x -lt $bmp.Width; $x++) {
  for ($y = 0; $y -lt $bmp.Height; $y++) {
    $c = $bmp.GetPixel($x, $y)
    if ($c.R -lt 60 -and $c.G -lt 60 -and $c.B -lt 60) {
      $result.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
    } else {
      $result.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $c.R, $c.G, $c.B))
    }
  }
}

$result.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$result.Dispose()

Write-Output "Saved $out"
