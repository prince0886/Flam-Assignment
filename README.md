# Flam-Assignment

Interactive Bézier Rope Simulation (HTML + JS)

This project shows an interactive rope made using a cubic Bézier curve on an HTML canvas.
The rope reacts smoothly to mouse movement using simple spring physics.

# Bézier Curve Math

I use a cubic Bézier curve with four control points:
P0 and P3 → fixed endpoints
P1 and P2 → dynamic control points
The curve is calculated manually using:
B(t) = (1−t)³P₀ + 3(1−t)²tP₁ + 3(1−t)t²P₂ + t³P₃
I draw the curve by sampling t from 0 to 1 with a step of 0.01 for smooth rendering.

# Tangent Calculation
Tangents are calculated using the derivative of the Bézier curve:
B′(t) = 3(1−t)²(P₁−P₀) + 6(1−t)t(P₂−P₁) + 3t²(P₃−P₂)
The tangent vectors are normalized and drawn as short yellow lines along the curve.
Physics Model
P1 and P2 move using a spring-damping model:
acceleration = -k × (position − target) − damping × velocity
k = 0.02 (spring stiffness)
damping = 0.85 (smooth motion)
This makes the rope feel soft and elastic instead of rigid.

# Interaction & Design
Mouse movement sets target positions for P1 and P2
Endpoints (P0, P3) stay fixed
Control points and tangents are visible for clarity
Animation runs using requestAnimationFrame (~60 FPS)

#Notes
No external libraries used
All Bézier math and physics are implemented manually
Built using HTML Canvas + Vanilla JavaScript
