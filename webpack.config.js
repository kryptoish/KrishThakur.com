module.exports = {
    module: {
      rules: [
        {
          test: /\.(webp)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[path][name].[ext]',
              },
            },
          ],
        },
      ],
    },
  };
  