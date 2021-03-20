precision highp float;

uniform float time;

varying vec2 vUv;

#include <common>
#include <fog_pars_vertex>

void main() {
   vUv = uv;
   #include <begin_vertex>
   #include <project_vertex>

   #include <fog_vertex>
}
