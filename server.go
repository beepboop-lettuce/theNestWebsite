package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	http.Handle("/", http.FileServer(http.Dir("./template")))

	port := ":5000"
	fmt.Println("Server is running on port" + port)

	// Start server on port specified above
	log.Fatal(http.ListenAndServe(port, nil))
}

func Serve(dirname string, port string) error {
	fs := http.FileServer(http.Dir(dirname))
	http.Handle("/", fs)

	return http.ListenAndServe(":"+port, nil)
}
