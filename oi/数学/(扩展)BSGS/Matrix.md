# Matrix
[BZOJ4128]

给定矩阵A,B和模数p,求最小的x满足  
A^x = B (mod p)

直接矩阵$BSGS$。判相同有两种方法，一种是$Hash$起来，挂链查询。另一种是乘以一个随机的一维矩阵，然后$O(n)$判同。  
非常卡常，注意到值域范围在五位数以内，所以不需要用$long long$，直接用$int$，否则会$TLE$。

$Hash$做法
```cpp
#include<iostream>
#include<cstdio>
#include<map>
#include<cmath>
#include<vector>
using namespace std;

#define ull unsigned long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
#define IL inline
#define RG register

const int maxN=75;
const ull base=13;
const int Mod=20000007;
const int maxNum=300;
const int inf=2147483647;

int n,P;
class Matrix{
public:
	int M[maxN][maxN];
	IL ull GetHash(){
		RG ull ret=0;RG int i,j;
		for (i=0;i<n;++i) for (j=0;j<n;++j) ret=ret*base+(ull)M[i][j];
		return ret;
	}
};

class HashTable
{
private:
	int edgecnt,Next[maxNum];
	map<int,int> Head;
	pair<ull,int> V[maxNum];
public:
	void Insert(pair<ull,int> pr){
		int p=pr.first%Mod;
		Next[++edgecnt]=Head[p];Head[p]=edgecnt;V[edgecnt]=pr;return;
	}

	int Query(ull key){
		int p=key%Mod,i;
		if (Head.count(p)==0) return -1;
		for (i=Head[p];i;i=Next[i]) if (V[i].first==key) return V[i].second;
		return -1;
	}
};

Matrix A,B,T,now;
HashTable HT;

IL Matrix Mul(const Matrix A,const Matrix B);
IL Matrix QPow(RG Matrix A,RG int cnt);

int main(){
	scanf("%d%d",&n,&P);
	RG int i,j;
	for (i=0;i<n;++i) for (j=0;j<n;++j) scanf("%d",&A.M[i][j]);
	for (i=0;i<n;++i) for (j=0;j<n;++j) scanf("%d",&B.M[i][j]);

	RG int m=ceil(sqrt(P));
	now=B;HT.Insert(make_pair(now.GetHash(),0));
	for (i=0;i<n;++i) T.M[i][i]=1;
	for (i=1;i<=m;++i){
		now=Mul(now,A);//T=Mul(T,A);
		HT.Insert(make_pair(now.GetHash(),i));
	}
	for (i=0;i<n;++i) for (j=0;j<n;++j) now.M[i][j]=0;
	T=QPow(A,m);
	for (i=0;i<n;++i) now.M[i][i]=1;
	for (i=1;i<=m;++i){
		now=Mul(now,T);
		RG int hs=HT.Query(now.GetHash());
		if (hs!=-1){
			printf("%d\n",((i*m-hs)%P+P)%P);break;
		}
	}

	return 0;
}

IL Matrix Mul(const Matrix A,const Matrix B){
	RG Matrix Ret;
	RG int i,j,k;
	for (i=0;i<n;++i) for (j=0;j<=n;++j) Ret.M[i][j]=0;
	for (k=0;k<n;++k)
		for (i=0;i<n;++i)
			for (j=0;j<n;++j)
				Ret.M[i][j]=(Ret.M[i][j]+A.M[i][k]*B.M[k][j]%P)%P;
	return Ret;
}

IL Matrix QPow(RG Matrix A,RG int cnt){
	RG Matrix Ret;RG int i;
	for (i=0;i<n;++i) Ret.M[i][i]=1;
	while (cnt){
		if (cnt&1) Ret=Mul(Ret,A);
		A=Mul(A,A);cnt>>=1;
	}
	return Ret;
}
```

随机一维矩阵做法
```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<map>
#include<cmath>
#include<vector>
using namespace std;

#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
#define IL inline
#define RG register

const int maxN=70;
const int maxNum=300;
const int inf=2147483647;

int n,P;
class Matrix{
public:
	int M[maxN][maxN];
	Matrix & operator = (const Matrix A){
		for (int i=0;i<n;i++) for (int j=0;j<n;j++) M[i][j]=A.M[i][j];
		return *this;
	}
};

Matrix A,B,C,T,now,Hash[maxNum];

Matrix Mul1(const Matrix A,const Matrix B);
Matrix QPow(RG Matrix A,RG int cnt);
Matrix Mul2(const Matrix A,const Matrix B);
bool Equ(const Matrix A,const Matrix B);

int main(){
	scanf("%d%d",&n,&P);
	RG int i,j;
	for (i=0;i<n;++i) for (j=0;j<n;++j) scanf("%d",&A.M[i][j]);
	for (i=0;i<n;++i) for (j=0;j<n;++j) scanf("%d",&B.M[i][j]);

	for (i=0;i<n;++i) C.M[0][i]=rand()%P;
	RG int m=ceil(sqrt(P));
	now=B;Hash[0]=Mul2(C,now);
	for (i=1;i<=m;++i){
		now=Mul1(now,A);Hash[i]=Mul2(C,now);
	}
	T=QPow(A,m);
	for (i=1;i<=m;++i){
		C=Mul2(C,T);
		for (j=m-1;j>=0;j--) if (Equ(C,Hash[j])){
			printf("%d\n",((i*m-j)%P+P)%P);break;
		}
	}

	return 0;
}

Matrix Mul1(const Matrix A,const Matrix B){
	RG Matrix Ret;
	RG int i,j,k;
	for (i=0;i<n;++i)
		for (j=0;j<n;++j){
			Ret.M[i][j]=0;
			for (k=0;k<n;++k)
				Ret.M[i][j]=(Ret.M[i][j]+A.M[i][k]*B.M[k][j])%P;
		}
	return Ret;
}

Matrix Mul2(const Matrix A,Matrix B){
	RG Matrix Ret;RG int i,j,k;
	for (i=0;i<n;++i) Ret.M[0][i]=0;
	for (j=0;j<n;++j){
		Ret.M[0][j]=0;
		for (k=0;k<n;++k)
			Ret.M[0][j]=(Ret.M[0][j]+A.M[0][k]*B.M[k][j])%P;
	}
	return Ret;
}

Matrix QPow(RG Matrix W,RG int cnt){
	RG Matrix Ret;RG int i;
	for (i=0;i<n;++i) Ret.M[i][i]=1;
	while (cnt){
		if (cnt&1) Ret=Mul1(Ret,W);
		W=Mul1(W,W);cnt>>=1;
	}
	return Ret;
}

bool Equ(Matrix A,Matrix B){
	for (int i=0;i<n;i++) if (A.M[0][i]!=B.M[0][i]) return 0;
	return 1;
}
```