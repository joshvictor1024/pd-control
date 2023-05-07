# pd-control

Live at https://joshvictor1024.github.io/pd-control/

An interactive demo of tracking using PD control.

## What is PD control?

*PID control* is a feedback control law based on the error value, the difference between a reference and a system output. The control input is the weighted sum of the terms:

- *P (proportional)*: proportional to the error
- *I (integral)*: grows with time when an error persists
- *D (derivative)*: proportional to the change in the error

*PD control* uses only terms P and D.

## Control saturation

*Saturation* occurs when the physical limit of the plant is reached. Control performance suffers when saturation occurs.

A step reference raises the error value suddenly and triggers saturation, which can be mitigated when the high-frequency components are filtered out. In general, path planning techniques generates a feasible reference path given the physical limit of the plant.

## Implementation

Code for the lowpass filter is taken from https://www.arc.id.au/FilterDesign.html

## TODO

- graph
