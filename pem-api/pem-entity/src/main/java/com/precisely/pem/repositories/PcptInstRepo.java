package com.precisely.pem.repositories;

import com.precisely.pem.models.PcptActivityInst;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PcptInstRepo extends JpaRepository<PcptActivityInst,String> {
}
