export const vertexFragment = `
  in vec2 aPosition;
  out vec2 vTextureCoord;

  void main(void)
  {
      gl_Position = vec4(aPosition * 2.0 - 1.0, 0.0, 1.0);
      vTextureCoord = vec2(aPosition.x, 1.0 - aPosition.y);
  }
`;