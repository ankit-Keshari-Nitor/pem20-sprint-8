package com.precisely.pem.repositories;

import com.precisely.pem.models.VCHActivityDefn;
import com.precisely.pem.models.VCHActivityDefnData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VCHActivityDefnDataRepo extends JpaRepository<VCHActivityDefnData,String> {
}
