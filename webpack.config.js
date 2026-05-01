const AngularComponentTagger = require('./angular-webpack-component-tagger');
const webpack = require('webpack');

module.exports = {
  plugins: [
    new AngularComponentTagger(),
    new webpack.DefinePlugin({
      'process.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xccigtseyhdmpwdlsijv.supabase.co'
      ),
      'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjY2lndHNleWhkbXB3ZGxzaWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMjU3MzIsImV4cCI6MjA5MjcwMTczMn0.gwV43Z_AsuhpNemzs4FfWI97h4ZdQZ0vjRbN26pqVzg'
      )
    })
  ]
};