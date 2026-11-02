$ErrorActionPreference='Stop'
Add-Type -AssemblyName System.Drawing
$root=Split-Path (Get-Location).Path -Parent
$records=Get-Content -Raw (Join-Path $root 'assets/behance/image-manifest.json') | ConvertFrom-Json
New-Item -ItemType Directory -Force 'dist/images' | Out-Null
$codec=[Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object {$_.MimeType -eq 'image/jpeg'}
$parameters=[Drawing.Imaging.EncoderParameters]::new(1)
$parameters.Param[0]=[Drawing.Imaging.EncoderParameter]::new([Drawing.Imaging.Encoder]::Quality,[long]83)
$index=0
foreach($record in $records){
 $index++
 $img=[Drawing.Image]::FromFile((Join-Path $root $record.path))
 foreach($size in @(640,1600)){
  $scale=([double]$size/[double][math]::Max($img.Width,$img.Height));if($scale -gt 1){$scale=1.0}
  $bitmap=[Drawing.Bitmap]::new([int][math]::Max(1,[math]::Round($img.Width*$scale)),[int][math]::Max(1,[math]::Round($img.Height*$scale)))
  $graphics=[Drawing.Graphics]::FromImage($bitmap)
  $graphics.InterpolationMode=[Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.DrawImage($img,0,0,$bitmap.Width,$bitmap.Height)
  $bitmap.Save((Join-Path (Get-Location).Path ('dist/images/{0:D3}-{1}.jpg' -f $index,$size)),$codec,$parameters)
  $graphics.Dispose();$bitmap.Dispose()
 }
 $img.Dispose()
}
$parameters.Dispose()
Write-Output "Prepared responsive versions of $index photographs."


