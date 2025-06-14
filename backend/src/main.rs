use axum::{routing::get, Router};

#[tokio::main]
async fn main() {
  let app = Router::new()
    .route("/", get(|| async { "Hello, World!" }));

  let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
    .await
    .expect("TCP listener binding");

  axum::serve(listener, app)
    .await
    .expect("Starting Axum server");
}
