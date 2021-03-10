precision highp float;

varying vec2 vUv;
uniform sampler2D photo;

void main() {
   vec3 color = texture2D(photo, vUv).xyz;
   gl_FragColor = vec4( color, 1.0 );
}