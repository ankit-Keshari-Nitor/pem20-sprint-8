package com.precisely.pem.repositories;

import com.precisely.pem.models.VCHActivityDefn;
import com.precisely.pem.models.VCHActivityDefnVersion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VCHActivityDefnVersionRepo extends JpaRepository<VCHActivityDefnVersion,String> {
}
