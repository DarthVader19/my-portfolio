# Generates raster fallbacks for public/favicon.svg (32x32 tab fallback + 180x180 apple-touch-icon).
# Mirrors the SVG: rounded "app tile" with an indigo gradient, a gradient "A" monogram, and a spark.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

function New-RoundedPath {
    param([float]$X, [float]$Y, [float]$W, [float]$H, [float]$R)
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $R * 2
    $path.AddArc($X, $Y, $d, $d, 180, 90)
    $path.AddArc($X + $W - $d, $Y, $d, $d, 270, 90)
    $path.AddArc($X + $W - $d, $Y + $H - $d, $d, $d, 0, 90)
    $path.AddArc($X, $Y + $H - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    return $path
}

function New-SparkPath {
    param([float]$Cx, [float]$Cy, [float]$Outer, [float]$Inner)
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $pts = New-Object System.Collections.Generic.List[System.Drawing.PointF]
    for ($i = 0; $i -lt 8; $i++) {
        $r = if ($i % 2 -eq 0) { $Outer } else { $Inner }
        $a = [Math]::PI / 4 * $i - [Math]::PI / 2
        $pts.Add([System.Drawing.PointF]::new(
            [float]($Cx + $r * [Math]::Cos($a)),
            [float]($Cy + $r * [Math]::Sin($a))))
    }
    $path.AddPolygon($pts.ToArray())
    return $path
}

function New-Favicon {
    param([int]$Size, [string]$OutPath)

    $s = [double]$Size / 64.0   # all geometry below is authored on a 64x64 grid
    $bmp = New-Object System.Drawing.Bitmap($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::Transparent)

    # Rounded tile with a diagonal navy -> near-black gradient
    $rect = New-Object System.Drawing.RectangleF(0, 0, $Size, $Size)
    $tileBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $rect,
        [System.Drawing.ColorTranslator]::FromHtml('#1c2150'),
        [System.Drawing.ColorTranslator]::FromHtml('#08090f'),
        [System.Drawing.Drawing2D.LinearGradientMode]::ForwardDiagonal)
    $tilePath = New-RoundedPath 0 0 $Size $Size (15 * $s)
    $g.FillPath($tileBrush, $tilePath)

    # Soft indigo glow in the upper-left (radial falloff approximated with a path gradient)
    $glowPath = New-RoundedPath 0 0 $Size $Size (15 * $s)
    $glow = New-Object System.Drawing.Drawing2D.PathGradientBrush($glowPath)
    $glow.CenterColor = [System.Drawing.Color]::FromArgb(115, 124, 140, 255)
    $glow.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 124, 140, 255))
    $glow.CenterPoint = New-Object System.Drawing.PointF((0.26 * $Size), (0.16 * $Size))
    $g.FillPath($glow, $glowPath)

    # 1px-equivalent hairline highlight around the tile edge
    $hair = New-Object System.Drawing.Pen(
        [System.Drawing.Color]::FromArgb(30, 255, 255, 255), [float](1.5 * $s))
    $g.DrawPath($hair, (New-RoundedPath (0.75 * $s) (0.75 * $s) ($Size - 1.5 * $s) ($Size - 1.5 * $s) (14.25 * $s)))

    # Gradient "A" monogram
    $monoRect = New-Object System.Drawing.RectangleF((14 * $s), (12 * $s), ($Size - 24 * $s), ($Size - 24 * $s))
    $monoBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        $monoRect,
        [System.Drawing.ColorTranslator]::FromHtml('#e2e6ff'),
        [System.Drawing.ColorTranslator]::FromHtml('#7c8cff'),
        [System.Drawing.Drawing2D.LinearGradientMode]::Vertical)
    $pen = New-Object System.Drawing.Pen($monoBrush, [float](7 * $s))
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    # Drawn as three separate strokes: a single path would implicitly close and
    # carve a wedge out of the glyph where the crossbar meets the right leg.
    $g.DrawLine($pen, [float](18.5 * $s), [float](50 * $s), [float](32 * $s), [float](15 * $s))
    $g.DrawLine($pen, [float](32 * $s), [float](15 * $s), [float](45.5 * $s), [float](50 * $s))
    $g.DrawLine($pen, [float](24 * $s), [float](37 * $s), [float](40 * $s), [float](37 * $s))

    # Spark accent
    $sparkBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml('#8b9bff'))
    $g.FillPath($sparkBrush, (New-SparkPath (50 * $s) (14 * $s) (6.5 * $s) (1.7 * $s)))

    $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $sparkBrush.Dispose(); $pen.Dispose(); $monoBrush.Dispose(); $hair.Dispose()
    $glow.Dispose(); $tileBrush.Dispose()
    $glowPath.Dispose(); $tilePath.Dispose(); $g.Dispose(); $bmp.Dispose()
}

$publicDir = Join-Path $PSScriptRoot '..\public'
New-Favicon 32  (Join-Path $publicDir 'favicon-32.png')
New-Favicon 180 (Join-Path $publicDir 'apple-touch-icon.png')
Write-Host 'Generated favicon-32.png and apple-touch-icon.png'